import {
  Configuration,
  SelfServiceLoginFlow,
  SelfServiceRecoveryFlow,
  SelfServiceRegistrationFlow,
  SelfServiceSettingsFlow,
  SelfServiceVerificationFlow,
  SubmitSelfServiceLoginFlowBody,
  SubmitSelfServiceRecoveryFlowBody,
  SubmitSelfServiceRegistrationFlowBody,
  SubmitSelfServiceSettingsFlowBody,
  SubmitSelfServiceVerificationFlowBody,
  UiNode,
  UiNodeInputAttributes,
  V0alpha2Api,
  V0alpha2ApiInterface,
} from '@ory/client'
import {
  isUiNodeInputAttributes,
  getNodeId,
  isUiNodeImageAttributes,
  isUiNodeScriptAttributes,
  isUiNodeTextAttributes,
  isUiNodeAnchorAttributes,
} from '@ory/integrations/ui'
import { useForm, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import { NodeAnchor } from './NodeAnchor'
import { NodeImage } from './NodeImage'
import { NodeInput } from './NodeInput'
import { NodeScript } from './NodeScript'
import { NodeText } from './NodeText'

export type SelfServiceFlow =
  | SelfServiceLoginFlow
  | SelfServiceRegistrationFlow
  | SelfServiceSettingsFlow
  | SelfServiceVerificationFlow
  | SelfServiceRecoveryFlow

export type Method =
  | 'oidc'
  | 'password'
  | 'profile'
  | 'totp'
  | 'webauthn'
  | 'link'
  | 'lookup_secret'

interface FlowProps {
  flow: SelfServiceFlow | undefined
  method: Method
}

let sdk: V0alpha2ApiInterface = new V0alpha2Api(
  new Configuration({ basePath: '/kratos' }),
) as unknown as V0alpha2ApiInterface

const filterNodes = (
  flow: SelfServiceFlow | undefined,
  targetGroup: Method | undefined,
): UiNode[] => {
  if (!flow) {
    return []
  }

  return flow.ui.nodes.filter(({ group }) => {
    if (targetGroup === undefined) {
      return true
    }

    return group === 'default' || group === targetGroup
  })
}

const getHiddenFieldNames = (nodes: UiNode[]): string[] => {
  return nodes
    .map(node => node.attributes)
    .filter(attr => isUiNodeInputAttributes(attr))
    .filter(attr => (attr as UiNodeInputAttributes).type === 'hidden')
    .map(attr => (attr as UiNodeInputAttributes).name)
}

const defaultValuesFromNodes = (nodes: UiNode[]): { [key: string]: any } => {
  const ignoredNodeTypes = ['button', 'submit']
  return nodes
    .filter(node => isUiNodeInputAttributes(node.attributes))
    .filter(
      node =>
        !ignoredNodeTypes.includes(
          (node.attributes as UiNodeInputAttributes).type,
        ),
    )
    .reduce((acc, node) => {
      const attr = node.attributes as UiNodeInputAttributes
      acc[attr.name] = attr.value
      return acc
    }, {} as { [key: string]: any })
}

const Flow = ({ flow, method }: FlowProps) => {
  const nodes = filterNodes(flow, method)
  const defaultValues = defaultValuesFromNodes(nodes)

  const { register, handleSubmit, formState, setValue, getValues, trigger } =
    useForm({
      defaultValues,
    })

  if (!flow) {
    return null
  }

  const onSubmit = async (data: any) => {
    if (flow === undefined) {
      console.error('no registration flow available to use')
      return
    }

    console.log(defaultValues, getValues(), data)

    try {
      const res = await sdk.submitSelfServiceRegistrationFlow(flow.id, data)
      console.log('finished', res)
    } catch (err) {
      console.error(err)
    }
  }

  const disabled = formState.isSubmitting

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {nodes.map((node, k) => {
        const id = getNodeId(node)
        return (
          <Node
            key={`${id}-${k}`}
            disabled={disabled}
            node={node}
            register={register}
          />
        )
      })}
    </form>
  )
}

interface NodeProps {
  node: UiNode
  disabled: boolean
  register: UseFormRegister<any>
}

export const Node = ({ node, disabled, register }: NodeProps) => {
  if (isUiNodeImageAttributes(node.attributes)) {
    return <NodeImage node={node} attributes={node.attributes} />
  }

  if (isUiNodeScriptAttributes(node.attributes)) {
    return <NodeScript node={node} attributes={node.attributes} />
  }

  if (isUiNodeTextAttributes(node.attributes)) {
    return <NodeText node={node} attributes={node.attributes} />
  }

  if (isUiNodeAnchorAttributes(node.attributes)) {
    return <NodeAnchor attributes={node.attributes} />
  }

  if (isUiNodeInputAttributes(node.attributes)) {
    return (
      <NodeInput
        node={node}
        disabled={disabled}
        attributes={node.attributes}
        register={register}
      />
    )
  }

  return null
}

export default Flow
